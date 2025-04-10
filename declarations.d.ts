// declarations.d.ts
declare module '*.html' {
    const content: number; // expo-asset usa o ID do asset, que é um `number`
    export default content;
}
