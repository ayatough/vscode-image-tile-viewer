import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// const IS_WIN = process.platform === "win32";
// const IS_MAC = process.platform === "darwin";
// const IS_LINUX = process.platform === "linux";


class ImageTileViewer {
	private static readonly supportImageFormats = [".jpeg", ".jpg", ".jpe", ".png", ".bmp", ".gif", ".webp", ".ico"];
	private panel: vscode.WebviewPanel | undefined = undefined;

	constructor(
		private readonly _context: vscode.ExtensionContext,
		private imageDirUri: vscode.Uri
	) {

		// this._view.webview.
		// create panel instance
		// this.panel = vscode.window.createWebviewPanel('viewer', imageDirUri.toString(), {
		// 	viewColumn: vscode.ViewColumn.One,
		// }, {
		// 	localResourceRoots: [
		// 		// vscode.Uri.file(dirPath),
		// 		imageDirUri,
		// 		vscode.Uri.joinPath(this._context.extensionUri, "frontend", "dist")
		// 	],
		// 	enableScripts: true,
		// 	retainContextWhenHidden: true
		// });

		// // set icon
		// const iconUri = vscode.Uri.joinPath(this._context.extensionUri, "media", "icon.svg");
		// this.panel.iconPath = vscode.Uri.file(iconUri.fsPath);

		// this.panel.webview.html = this._getWebviewContent(context);
	}

	private dispose () {

	}

	public makeView() {
		// const fileList = vscode.workspace.fs.readDirectory(dirPath);
		// console.log(fileList);

		// 	if (err) {
		// 		console.log(err);
		// 		return;
		// 	}

		// 	console.log(dirPath);

		// create panel instance
		this.panel = vscode.window.createWebviewPanel('viewer', this.imageDirUri.toString(), {
			viewColumn: vscode.ViewColumn.One,
		}, {
			localResourceRoots: [
				this.imageDirUri,
				vscode.Uri.joinPath(this._context.extensionUri, "frontend", "dist")
			],
			enableScripts: true,
			retainContextWhenHidden: true
		});

		// set icon
		this.panel.iconPath = vscode.Uri.joinPath(this._context.extensionUri, "media", "icon.svg");

		this.panel.webview.html = this._getWebviewContent(this.panel.webview);
	}

	private _readFileEntries() {
		vscode.workspace.fs.readDirectory(this.imageDirUri).then((value) => {

		}, (error) => {
			console.log("something error.");
		});
	}

	public sendImageContents() {
		if (this.panel === undefined) {
			throw new Error("panel is indefined !!!");
		}
		vscode.workspace.fs.readDirectory(this.imageDirUri).then((file_entries) => {
			// extract img files
			let file_names: string[] = [];
			file_entries.forEach((file_entry: [string, vscode.FileType]) => {
				// console.log(file_entry);
				const file_name: string = file_entry[0];
				if (ImageTileViewer.supportImageFormats.includes(path.extname(file_name).toLocaleLowerCase())) {
					file_names.push(file_name);
				}
			});

			// notify image resource info to JS
			let data: any[] = [];
			file_names.forEach(name => {
				const unique_time = new Date().getTime();
				const uri = vscode.Uri.joinPath(this.imageDirUri, name);
				const relative_path = name;
				const record = {
					resource_path: this.panel?.webview.asWebviewUri(uri).toString() + "?t=" + unique_time.toString(),
					relative_path: relative_path,
				};
				data.push(record);
			});
			this.panel?.webview.postMessage({ command: 'sendResources', data: data });

		}, (error) => {
			console.log("something error.");
		});

	}

	public registerCommand() {
		// recieve click event on DOM
		this.panel?.webview.onDidReceiveMessage(message => {
			switch (message.command) {
				case 'openImage':
					{
						// console.log(message.src);
						// console.log(vscode.Uri.parse(message.src, false));
						// console.log(vscode.Uri.parse(message.src, true));
						
						const uri = vscode.Uri.parse(message.src, false);
						const columns = message.newTab ? vscode.ViewColumn.Active : vscode.ViewColumn.Beside; 
						vscode.commands.executeCommand('vscode.open', uri, columns).then(
							() => null,
							() => "unable to open image."
						);
					}
				case 'reload':
					{
						console.log("reload!!");
						// this.panel?.dispose();

						// this.makeView();
						this.sendImageContents();
					}
			}
		},
			undefined,
			this._context.subscriptions
		);
	}

	private _getWebviewContent(
		webview: vscode.Webview
	): string {
		const scriptUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._context.extensionUri, "frontend", "dist", "bundle.js")
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
				<script nonce=${getNonce()} src=${scriptUri}></script>
			</body>
			</html>`;
	}
}


function startView(context: vscode.ExtensionContext) {
	vscode.window.showOpenDialog({
		canSelectFolders: true,
		defaultUri: vscode.workspace.workspaceFolders === undefined ? undefined : vscode.workspace.workspaceFolders[0].uri
	}).then(dirUris => {
		const exists = (uris: vscode.Uri[] | undefined) => uris !== undefined && uris[0] !== undefined;
		if (dirUris !== undefined && dirUris?.length !== 0) {
			const viewer = new ImageTileViewer(context, dirUris[0]);

			viewer.makeView();
			viewer.sendImageContents();
			viewer.registerCommand();
		}
	});
}

export function activate(context: vscode.ExtensionContext) {

	// const manager = new ImageTileManager(context.extensionUri);

	context.subscriptions.push(
		vscode.commands.registerCommand('image-tile-viewer.open', () => {
			startView(context);
		})
	);
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

export function deactivate() { }
