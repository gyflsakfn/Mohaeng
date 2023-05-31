import { IPlace } from "../interfaces/Course.type";

export function validateTitle(title: string): boolean {
  const MIN_LENGTH = 4;
  const MAX_LENGTH = 25;

  if (MIN_LENGTH <= title.length && MAX_LENGTH >= title.length) {
    return true;
  }

  return false;
}

export function validateContent(content: string): boolean {
  const MIN_LENGTH = 10;
  const MAX_LENGTH = 200;

  if (MIN_LENGTH <= content.length && MAX_LENGTH >= content.length) {
    return true;
  }

  return false;
}

export function validateStartEndDate(
  startDate: string,
  endDate: string
): boolean {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  // startDate가 endDate 이전이 아니면 유효하지 않은 값입니다.
  if (startDateObj.getTime() > endDateObj.getTime()) {
    return false;
  }

  return true;
}
export function validateIsSelected(value: string): boolean {
  // courseDays가 선택되지 않았으면 유효하지 않은 값입니다.
  if (value) {
    return true;
  }

  return false;
}

export function validatePlaces(places: IPlace[]): boolean {
  // places 배열에 요소가 없으면 유효하지 않은 값입니다.
  if (places.length === 0) {
    return false;
  }

  return true;
}
