import { BackupService, IBackupService } from "@dendronhq/engine-server";
import { QuickPickItem, Uri, window, workspace } from "vscode";
import { VSCodeUtils } from "../vsCodeUtils";
import { DENDRON_COMMANDS } from "../constants";
import { IDendronExtension } from "../dendronExtensionInterface";
import { BasicCommand } from "./base";
import path from "path";

type OpenBackupCommandOpts = {};

export class OpenBackupCommand extends BasicCommand<
  OpenBackupCommandOpts,
  void
> {
  key = DENDRON_COMMANDS.OPEN_BACKUP.key;
  private extension: IDendronExtension;
  private backupService: IBackupService;

  constructor(ext: IDendronExtension) {
    super();
    this.extension = ext;
    const ws = this.extension.getDWorkspace();
    this.backupService = new BackupService({ wsRoot: ws.wsRoot });
  }

  async promptBackupEntrySelection(opts: { backups: string[] }) {
    const { backups } = opts;
    const options: QuickPickItem[] = backups.map((backupName) => {
      return {
        label: backupName,
      };
    });
    const selectedBackupName = await VSCodeUtils.showQuickPick(options, {
      title: "Pick which backup file you want to open.",
      ignoreFocusOut: true,
      canPickMany: false,
    });
    return selectedBackupName;
  }

  async promptBackupKeySelection(opts: {
    allBackups: { key: string; backups: string[] }[];
  }) {
    const { allBackups } = opts;
    const options: QuickPickItem[] = allBackups
      .filter((keyEntry) => {
        return keyEntry.backups.length > 0;
      })
      .map((keyEntry) => {
        return {
          label: keyEntry.key,
          detail: `${keyEntry.backups.length} backup(s)`,
        };
      });

    if (options.length > 0) {
      const backupKey = await VSCodeUtils.showQuickPick(options, {
        title: "Pick which kind of backup you want to open.",
        ignoreFocusOut: true,
        canPickMany: false,
      });
      if (backupKey) {
        const selected = allBackups.find((keyEntry) => {
          return keyEntry.key === backupKey.label;
        });

        if (selected) {
          const selectedBackupName = await this.promptBackupEntrySelection({
            backups: selected.backups,
          });

          if (selectedBackupName) {
            const backupFile = await workspace.openTextDocument(
              Uri.file(
                path.join(
                  this.backupService.backupRoot,
                  selected.key,
                  selectedBackupName.label
                )
              )
            );
            window.showTextDocument(backupFile);
          } else {
            window.showInformationMessage("No backup selected.");
          }
        } else {
          window.showInformationMessage(
            "There are no backups saved for this key."
          );
        }
      }
    } else {
      window.showInformationMessage("There are no backups saved.");
    }
  }

  async execute(opts?: OpenBackupCommandOpts): Promise<void> {
    const ctx = "execute";
    this.L.info({ ctx, opts });
    const allBackups = this.backupService.getAllBackups();
    await this.promptBackupKeySelection({ allBackups });
  }
}
