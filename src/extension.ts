import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

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
						const resource_path = vscode.Uri.parse(path.join(dir_path, name)).with({ scheme: 'vscode-resource' });
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
									const uri = vscode.Uri.parse(message.src, true).with({ scheme: 'file' })
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
