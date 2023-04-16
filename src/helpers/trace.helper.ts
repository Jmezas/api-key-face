import { v4 as uuidv4 } from 'uuid';
export class Trace {
  private static instance: Trace;
  private id: string = '';
  constructor() {}
  public static TraceId(start: boolean = false): string {
    if (!Trace.instance) {
      Trace.instance = new Trace();
      Trace.instance.id = uuidv4();
    } else if (Trace.TraceId && start) {
      Trace.instance.id = uuidv4();
    }
    return Trace.instance.id;
  }
}
