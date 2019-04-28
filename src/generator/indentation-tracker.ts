import { times, noop, constant, isEmpty } from 'lodash';

export class IndentationTracker {
    constructor(private baseIndent = 4, private curIndent = 0, public output = "") {}
    indent() {
        this.curIndent += this.baseIndent;
    }
    dedent() {
        this.curIndent -= this.baseIndent;
        if (this.curIndent < 0) this.curIndent = 0;
    }
    addLine(str: string) {
        times(this.curIndent, () => (this.output += " "));
        this.output += str;
        if (this.output.charAt(this.output.length - 1) !== "\n") this.output += "\n";
    }
    reIndentBlock(str: string) {
        return str
            .split("\n")
            .map(line => times(this.curIndent, constant(" ")).join("") + line)
            .filter(line => !isEmpty(line))
            .join("\n");
    }
    addBlock(start = "{", callback = noop, end = "}", ) {
        if (start) this.addLine(start);
        this.indent();
        callback();
        this.dedent();
        if (end) this.addLine(end);
    }
    wrap(start = "{", end = "}") {
        const { output } = this;
        this.output = "";
        if (start) this.addLine(start);
        this.curIndent = 0;
        this.indent();
        const lines = output.split("\n").slice(0, -1);
        for (const line of lines) {
            this.addLine(line);
        }
        this.dedent();
        if (end) this.addLine(end);
    }
    isEmpty() {
        return isEmpty(this.output);
    }
    toString() {
        return this.output;
    }
}
