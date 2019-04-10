export function getProp(obj: any, prop: Array<string | number>, defaultValue: any = undefined): any {
  const value = prop.reduce((acc, i) => acc ? acc[i] : undefined, obj);
  return (value !== undefined) ? value : defaultValue;
}
