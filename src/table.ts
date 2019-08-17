import * as vscode from "vscode";
import { Rule } from "./rule";

export interface TableEntry {
  rule: Rule;
  ruleIndex: number;
  group: Rule[];
}

export type Table = TableEntry[];

export function getTable(config: string[][]): Table {
  const table: Table = [];

  config.forEach(patterns => {
    if (patterns.length < 2) {
      return;
    }

    const group = patterns.map(p => new Rule(p));
    group.forEach((rule, ruleIndex) => {
      table.push({ rule, ruleIndex, group });
    });
  });

  table.sort((a, b) => b.rule.score - a.rule.score);

  return table;
}

export type Direction = "forward" | "back";

export async function findInTable(
  table: Table,
  baseFilePath: string,
  direction: Direction
): Promise<vscode.Uri> {
  for (let { rule, ruleIndex, group } of table) {
    const match = baseFilePath.match(rule.regexp);
    if (!match) {
      continue;
    }

    switch (direction) {
      case "forward": {
        group = group.slice(ruleIndex + 1).concat(group.slice(0, ruleIndex));
        break;
      }
      case "back": {
        group = group
          .slice(0, ruleIndex)
          .reverse()
          .concat(group.slice(ruleIndex + 1).reverse());
        break;
      }
    }

    for (let rule of group) {
      const glob = rule.glob(match.slice(1));
      try {
        const uris = await findFiles(glob);
        if (uris.length) {
          return uris[0];
        }
      } catch {}
    }
  }

  throw new Error();
}

async function findFiles(glob: vscode.GlobPattern): Promise<vscode.Uri[]> {
  return new Promise((resolve, reject) => {
    vscode.workspace
      .findFiles(glob, "")
      .then(urls => resolve(urls), (reason: any) => reject(reason));
  });
}
