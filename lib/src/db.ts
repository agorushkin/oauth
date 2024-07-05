import { guard } from '/lib/src/util/guard.ts';

export class DB<Data> {
  filepath: string;
  data: Data;

  constructor(filepath: string, data: Data) {
    this.filepath = filepath;
    this.data = data;
  }

  read = async () => {
    await guard(async () => {
      const json = await Deno.readTextFile(this.filepath);
      this.data = JSON.parse(json);
    });
  };

  write = async () => {
    const json = JSON.stringify(this.data, null, 2);
    await Deno.writeTextFile(this.filepath, json);
  };

  update = async (callback: (data: Data) => void | Promise<void>) => {
    const stash = this.data;
    const { ok } = await guard(callback, this.data);

    if (!ok) {
      this.data = stash;
      return false;
    } else {
      const { ok } = await guard(this.write);
      return ok;
    }
  };
}
