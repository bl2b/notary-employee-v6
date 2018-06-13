import { DescriptifGroupFieldDto } from "./descriptifGroupFieldDto";

export interface DescriptifGroupDto {
    Id?: string;
    Fields?: DescriptifGroupFieldDto[];
    Title?: string;
    Title_DE?: string;
    Title_EN?: string;
    Title_FR?: string;
    Title_NL?: string;
    Type?: string;
    SortOrder?: number;
}