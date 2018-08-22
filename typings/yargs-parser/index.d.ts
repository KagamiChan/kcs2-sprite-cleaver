declare module 'yargs-parser' {
  interface Argv {
    _: string[]
  }

  interface Kwargs {
    [key: string]: string | number | boolean
  }

  const yargsParser: (argv: string[]) => Argv & Kwargs

  export default yargsParser
}
