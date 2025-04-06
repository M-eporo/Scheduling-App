declare module "@fullcalendar/tooltip" {
  export default class Tooltip {
    constructor(element: HTMLElement, options: TooltipOptions);
  }

  export interface TooltipOptions {
    title?: string;
    placement?: string;
    trigger?: string;
    container?: string;
  }
}