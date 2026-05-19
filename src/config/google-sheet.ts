/** [wibestats](https://docs.google.com/spreadsheets/d/17YIaSfHEPxr_6cqkCjwF8WX2h4zk6n58SlRXNv7nk8g/edit) */
export const WIBESTATS_SPREADSHEET_ID = "17YIaSfHEPxr_6cqkCjwF8WX2h4zk6n58SlRXNv7nk8g";

export const HEALTH_SHEET_TAB = "health public";

/** Public JSON via [OpenSheet](https://opensheet.elk.sh/) — no API key. */
export function healthOpenSheetUrl(): string {
  const id = import.meta.env.VITE_GOOGLE_SHEET_ID?.trim() || WIBESTATS_SPREADSHEET_ID;
  const tab = HEALTH_SHEET_TAB.replace(/ /g, "+");
  // Without raw=true dates stay as yyyy-mm-dd strings (raw= mixes in Excel serial numbers).
  return `https://opensheet.elk.sh/${id}/${tab}`;
}
