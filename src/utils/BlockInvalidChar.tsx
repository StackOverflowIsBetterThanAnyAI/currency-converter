export const BlockInvalidChar = (e: any) =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()
