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
	if (residue_pos !== 0)
	{
		return parsed_path;
	}
	else
	{
		return parsed_path.substring(len);
	}
}

export function activate(context: vscode.ExtensionContext) {

	const image_format_list = [".jpeg", ".jpg", ".jpe", ".png", ".bmp", ".gif", ".webp"];

	let panel : vscode.WebviewPanel;

	context.subscriptions.push(
		vscode.commands.registerCommand('image-tile-viewer.open', () => {
	
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

						console.log(dir_path);
	
						// create panel instance
						panel = vscode.window.createWebviewPanel('viewer', dir_path, {
							viewColumn: vscode.ViewColumn.One,
						}, {
							localResourceRoots: [
								vscode.Uri.file(dir_path),
								vscode.Uri.file(path.join(context.extensionPath, "frontend", "dist"))
							],
							enableScripts: true,
							retainContextWhenHidden: true
						});

						// set icon
						panel.iconPath = vscode.Uri.file(path.join(context.extensionPath, "media", "icon.svg"));

						panel.webview.html = getWebviewContent(context, panel.webview);

						// extract img files
						let file_names: string[] = [];
						dirents.forEach((file: fs.Dirent) => {
							if (image_format_list.includes(path.extname(file.name).toLocaleLowerCase())) {
								file_names.push(file.name);
							}
						});
	
						// notify image resource info to JS
						let data: any[] = [];
						file_names.forEach(name => {
							const uri = vscode.Uri.file(path.join(dir_path, name));
							const relative_path = name;
							const record = {
								resource_path: panel.webview.asWebviewUri(uri).toString(),
								relative_path: relative_path,
							};
							data.push(record);
						});
						panel.webview.postMessage({ command: 'sendResources', data: data });

						// recieve click event on DOM
						panel.webview.onDidReceiveMessage(message => {
							switch (message.command) {
								case 'openImage':
									const uri = vscode.Uri.file(get_clean_path(message.src)).with({ scheme: 'file' });
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
				}
			});
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('image-tile-viewer.send', () => {
			panel.webview.postMessage({ command: 'sendMessage' });
		})
	);
}

function getWebviewContent(
  context: vscode.ExtensionContext,
  webview: vscode.Webview
): string {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.file(
      path.join(context.extensionPath, "frontend", "dist", "bundle.js")
    )
  );
  return `<!DOCTYPE html>
  <html>
	<head>
	  <meta charset="utf-8" />
	  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	  <meta name="viewport" content="width=device-width,initial-scale=1.0">
	  <link rel="icon" href="favicon.ico">
	  <title>Image Tile Viewer</title>
	</head>
	<body>
	  <div id="app"></div>
	  <script src=${scriptUri}></script>
	</body>
  </html>`;
}

export function deactivate() { }
