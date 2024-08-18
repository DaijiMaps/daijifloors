export let Lexer: any;
export let ParserRules: ({
    name: string;
    symbols: string[];
    postprocess: (d: any) => any;
} | {
    name: string;
    symbols: (string | RegExp)[];
    postprocess: (d: any) => any[];
} | {
    name: string;
    symbols: (string | {
        literal: string;
    })[];
    postprocess?: undefined;
} | {
    name: string;
    symbols: (string | {
        literal: string;
    })[];
    postprocess: (d: any) => number;
} | {
    name: string;
    symbols: (string | RegExp)[];
    postprocess?: undefined;
} | {
    name: string;
    symbols: (string | {
        literal: string;
        pos: number;
    })[];
    postprocess: (d: any) => {
        type: string;
        matrix: any[];
    };
} | {
    name: string;
    symbols: (string | {
        literal: string;
        pos: number;
    })[];
    postprocess?: undefined;
} | {
    name: string;
    symbols: (string | {
        literal: string;
        pos: number;
    })[];
    postprocess: (d: any) => {
        type: string;
        x: any;
        y: any;
    };
} | {
    name: string;
    symbols: (RegExp | {
        literal: string;
    })[];
    postprocess: (e: any) => any;
} | {
    name: string;
    symbols: (string | {
        literal: string;
        pos: number;
    })[];
    postprocess: (d: any) => {
        type: string;
        value: any;
    };
})[];
export let ParserStart: string;
