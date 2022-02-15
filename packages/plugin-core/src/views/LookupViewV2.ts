import {
  DendronError,
  DMessage,
  LookupViewMessage,
  LookupViewMessageEnum,
} from "@dendronhq/common-all";
import { Logger } from "../logger";
import * as vscode from "vscode";
import { LookupViewModel } from "../components/lookup/LookupViewModel";

export class LookupPanelView implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;
  private _viewModel: LookupViewModel;

  constructor(viewModel: LookupViewModel) {
    this._viewModel = viewModel;
    this.bindToViewModel();
  }

  private bindToViewModel() {
    //TODO: Add more bindigns
    const disposable = this._viewModel.selectionState.bind((newValue) => {
      // TODO: this.refresh();
    });

    //TODO: Register disposable
  }

  public postMessage(msg: DMessage) {
    this._view?.webview.postMessage(msg);
  }

  public async resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext<unknown>,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.onDidReceiveMessage(
      this.onDidReceiveMessageHandler,
      this
    );

    // TODO: register initial state
  }

  async onDidReceiveMessageHandler(msg: LookupViewMessage) {
    const ctx = "onDidReceiveMessage";
    Logger.info({ ctx, data: msg });
    switch (msg.type) {
      case LookupViewMessageEnum.onValuesChange: {
        Logger.info({
          ctx: `${ctx}:onValuesChange`,
          data: msg.data,
        });

        const { category, type, checked } = msg.data;
        switch (category) {
          case "selection":
            // TODO: not implemented
            break;
          case "note": {
            // TODO: not implemented
            break;
          }
          case "effect": {
            // TODO: not implemented
            break;
          }
          case "filter":
            this._viewModel.isApplyDirectChildFilter.value = checked as boolean;
            break;
          case "split": {
            // TODO: not implemented
            break;
          }
          default: {
            throw new DendronError({
              message: "Got unexpected button category",
              payload: {
                ctx: "LookupView.onDidReceiveMessageHandler",
                category,
              },
            });
          }
        }
        break;
      }
      case LookupViewMessageEnum.onRequestControllerState: {
        // TODO: Implement
        break;
      }
      case LookupViewMessageEnum.onUpdate:
      default:
        break;
    }
  }
}
