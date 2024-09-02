import { Timestamp } from "firebase/firestore";
import type { ShortTimestamp } from "../components";

export const POSTS = "posts";
export const TAGS = "tags";
export const CATEGORIES = "categories";
export const PAGES = "pages";

/**
 * Take a Timestamp or shortTimestamp and returns Date
 * @param timeStamp
 */
export const timeStampToDate = (
	timeStamp: ShortTimestamp | Timestamp,
): Date => {
	// Check if the input is an instance of Firestore Timestamp
	if (timeStamp instanceof Timestamp) {
		return timeStamp.toDate();
	}

	// If not, assume it's a ShortTimeStamp and manually create a Timestamp
	return new Timestamp(timeStamp._seconds, timeStamp._nanoseconds).toDate();
};
