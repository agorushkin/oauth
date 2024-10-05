import { intercept } from '/lib/utils/intercept.ts';

export class DB<Data> {
  filepath: string;
  data: Data;

  constructor(filepath: string, data: Data) {
    this.filepath = filepath;
    this.data = data;
  }

  read = async (): Promise<void> => {
    await intercept(async () => {
      const json = await Deno.readTextFile(this.filepath);
      this.data = JSON.parse(json);
    });
  };

  write = async (): Promise<void> => {
    const json = JSON.stringify(this.data, null, 2);
    await Deno.writeTextFile(this.filepath, json);
  };

  update = async (callback: (data: Data) => void | Promise<void>): Promise<boolean> => {
    const stash = this.data;
    const { ok } = await intercept(callback, this.data);

    if (!ok) {
      this.data = stash;
      return false;
    } else {
      const { ok } = await intercept(this.write);
      return ok;
    }
  };
}
