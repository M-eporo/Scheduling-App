import { escapeHtml } from "./escapeHtml";

export const createTooltipHtml = ({
  title,
  isAllDay,
  start,
  end
}: {
    title: string;
    isAllDay: string;
    start: string;
    end: string;
}): string => {
  return `
    <div>
      <h4>${escapeHtml(title)} ${isAllDay && isAllDay}</h4>
      <p>${start && `開始: ${escapeHtml(start)}`}</p>
      <p>${end && `終了: ${escapeHtml(end)}`}</p>
    </div>
  `;
};