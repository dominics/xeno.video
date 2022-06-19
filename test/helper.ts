import path from "path";
import config from "../config";

export function outfile(ident: string[] = [], extension = ".log"): string {
    const identifier = Array.isArray(ident) && ident.length > 1 ? ident.join("-") : "xeno";
    return path.join(
        config.build.output,
        `${identifier}-${new Date().getTime()}${extension}`
    );
}
