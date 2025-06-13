/* 
We create the types to be able to use them

{Object.values(commands[tab]).flat().map((cmd) => (
  <CommandBox command={cmd} />
))}

Ya le decimos a TypeScript: “commands es un objeto indexable por string”.
*/

export interface CommandCategory {
  [section: string]: string[];
}

export interface CommandData {
  [category: string]: CommandCategory;
}

export interface Theme {
  bg: string;
  text: string;
  border: string;
}

export type ThemeData = Record<string, Theme>;
