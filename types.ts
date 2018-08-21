export interface IIMageInfo {
  frames: IFrames
  meta: IMeta
}

export interface IFrames {
  [key: string]: IFrame
}

export interface IFrame {
  frame: IPosSize
  rotated: boolean
  trimmed: boolean
  spriteSourceSize: IPosSize
  sourceSize: ISize
}

export interface IPosSize {
  x: number
  y: number
  w: number
  h: number
}

export interface ISize {
  w: number
  h: number
}

export interface IMeta {
  app: string
  image: string
  format: string
  size: ISize
  scale: number
}
