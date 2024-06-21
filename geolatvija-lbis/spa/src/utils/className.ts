/**
 *
 */
export class ClassNameUtil {
  private className: string[] = [];

  public add = (
    className: string | null | undefined,
    checkableValue: boolean | undefined = true
  ) => {
    if (className && checkableValue) {
      this.className.push(className);
    }
  };

  public remove = (
    className: string | null | undefined,
    checkableValue: boolean | undefined = true
  ) => {
    if (className && checkableValue) {
      const index = this.className.indexOf(className);
      this.className.splice(index);
    }
  };

  public getClassName(): string {
    return this.className.join(' ');
  }
}
