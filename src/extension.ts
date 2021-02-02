import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const IS_WIN = process.platform === "win32";
const IS_MAC = process.platform === "darwin";
const IS_LINUX = process.platform === "linux";
const residue_prefix : string = IS_WIN ? "\\file\\\\" : IS_MAC || IS_LINUX ? "/file//" : "";

// "" -> ""
function get_clean_path(path: string) : string {
	const parsed_path = vscode.Uri.parse(path, false).fsPath;  // remove "://"
	const residue_pos = parsed_path.indexOf(residue_prefix);  // remove "/file/" here
	const len = residue_prefix.length;
	if (residue_pos != 0)
	{
		return parsed_path;
	}
	else
	{
		return parsed_path.substring(len);
	}
}

export function activate(context: vscode.ExtensionContext) {

	const html_path = path.join(context.extensionPath, "media", "main.html");
	const image_format_list = [".jpeg", ".jpg", ".jpe", ".png", ".bmp", ".gif", ".webp"]

	let disposable = vscode.commands.registerCommand('image-tile-viewer.open', () => {
		
		vscode.window.showOpenDialog({
			canSelectFolders: true,
			defaultUri: vscode.workspace.workspaceFolders === undefined ? undefined : vscode.workspace.workspaceFolders[0].uri
		}).then(dir_uri => {
			if (dir_uri && dir_uri[0]) {
				const dir_path = dir_uri[0].fsPath;
				fs.readdir(dir_path, { withFileTypes: true }, (err, dirents) => {
					if (err) {
						console.log(err);
						return;
					}

					// create panel instance
					const panel = vscode.window.createWebviewPanel('viewer', dir_path, {
						viewColumn: vscode.ViewColumn.One,
					}, {
						localResourceRoots: [vscode.Uri.file(dir_path)],
						enableScripts: true,
						retainContextWhenHidden: true
					});

					// extract img files
					let file_names: string[] = []
					dirents.forEach((file: fs.Dirent) => {
						if (image_format_list.includes(path.extname(file.name).toLocaleLowerCase())) file_names.push(file.name);
					});

					// make insert img DOM string
					let content: string = ""
					file_names.forEach(name => {
						const uri = vscode.Uri.file(path.join(dir_path, name));
						const resource_path = uri.with({ scheme: 'vscode-resource' });
						content += `<div><img src="${resource_path}" title="${name}"/></div>`;
					});

					// read template html and view
					fs.readFile(html_path, (err, data) => {
						if (err) {
							console.log(err);
							return;
						}
						panel.webview.html = data.toString().replace("${content}", content);

						panel.webview.onDidReceiveMessage(message => {
							switch (message.command) {
								case 'openImage':
									const uri = vscode.Uri.file(get_clean_path(message.src)).with({ scheme: 'file' })
									vscode.commands.executeCommand('vscode.open', uri, vscode.ViewColumn.Beside).then(
										() => null,
										() => "unable to open image."
									);
							}
						},
							undefined,
							context.subscriptions
						);
					});
				});

			}
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
