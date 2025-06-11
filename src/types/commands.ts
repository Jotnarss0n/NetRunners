/* 
Creamos los tipos para porder usar

{Object.values(commands[tab]).flat().map((cmd) => (
  <CommandBox command={cmd} />
))}

ya le decimos a TypeScript: “commands es un objeto indexable por string”.
*/
export interface CommandCategory {
    [section: string]: string[];
  }
  
  export interface CommandData {
    [category: string]: CommandCategory;
  }
  