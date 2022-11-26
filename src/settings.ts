import { workspace } from "vscode";

export function getExpandCodeList(): string[] {
  const config = workspace.getConfiguration("vscode-jupyter-python");
  const expandCodeList = config.get<string[]>("expandCodeList", []);
  return expandCodeList;
}
