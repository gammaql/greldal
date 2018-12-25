import * as ts from "typescript";
import * as fs from "fs";
import * as path from "path";
// @ts-ignore
import dox from "dox";
import { pick, first } from "lodash";

interface DocEntry {
  location?: {
    fileName: string,
    start: number,
    end: number
  },
  kind: string,
  name?: string;
  fileName?: string;
  documentation?: any;
  type?: string;
  constructors?: DocEntry[];
  parameters?: DocEntry[];
  returnType?: string;
  content: string;
}

/** Generate documentation for all classes in a set of .ts files */
function generateDocumentation(
  fileNames: string[],
  options: ts.CompilerOptions
): void {
  // Build a program using the set of root file names in fileNames
  let program = ts.createProgram(fileNames, options);

  // Get the checker, we will use it to find more about classes
  let checker = program.getTypeChecker();

  let output: DocEntry[] = [];

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree to search for classes
      ts.forEachChild(sourceFile, visit);
    }
  }

  // print out the doc
  fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));

  return;

  /** visit nodes finding exported classes */
  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) || ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
        if (node.name) {
          const symbol = checker.getSymbolAtLocation(node.name);
          if (symbol) {
            const serialized = serializeSymbol(symbol, node);
            if (serialized.documentation && serialized.documentation.tags.length > 0) {
              output.push(serializeSymbol(symbol, node))
            }
          }
        }
    }
    ts.forEachChild(node, visit);
  }

  /** Serialize a symbol into a json object */
  function serializeSymbol(symbol: ts.Symbol, node: ts.Node): DocEntry {
    const fileName = path.normalize(node.getSourceFile().fileName);
    const relFileName = fileName.replace(path.normalize(process.cwd() + '/'), '');
    const start = node.getStart(undefined, true);
    const end = node.getEnd();
    const content = node.getSourceFile().getFullText().slice(start, end);
    const docStringMatcher = content.match(/\/\*\*(.|[\n\r])*\*\//);
    const documentation = docStringMatcher ? dox.parseComments(docStringMatcher[0], {}) : null;
    return {
      location: {
        fileName: relFileName,
        start,
        end,
      },
      kind: `${node.kind}`,
      name: symbol.getName(),
      documentation: documentation && pick(first(documentation), ['tags', 'description', 'isPrivate']),
      content,
      type: checker.typeToString(
        checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!),
        undefined,
        ts.TypeFormatFlags.NoTruncation
      )
    };
  }

  /** True if this is visible outside this file, false otherwise */
  function isNodeExported(node: ts.Node): boolean {
    return (
      (ts.getCombinedModifierFlags(node as any & ts.ModifierFlags.Export) !== 0) ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }
}

generateDocumentation(process.argv.slice(2), {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS
});