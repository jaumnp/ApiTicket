export function routesParse(path) {
    const routerParamsRegex = /:([a-zA-Z]+)/g;
    const params = path.replaceAll(routerParamsRegex, "(?<$1>[a-zA-Z0-9-_ %]+)");
    
    return new RegExp(`^${params}$`);
}