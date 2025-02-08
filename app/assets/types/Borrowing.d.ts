declare module "~/assets/json/Borrowing.json" {
    export type JBorrowing = BorrowingBlock[];

    export interface BorrowingBlock {
        title: string;
        items: BorrowingItem[];
    }

    export interface BorrowingItem {
        src: BorrowingInfo;
        creator: BorrowingInfo;
    }

    export interface BorrowingInfo {
        name: string;
        link: string;
    }

    const data: JBorrowing;
    export default data;
}