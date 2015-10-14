import path from 'path';

export default function requireApp(filePath) {
    return require(path.resolve(path.join('src', 'scripts', filePath)));
}
