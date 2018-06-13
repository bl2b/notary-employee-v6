import { DescriptifGroupDto } from "./descriptifGroupDto";


export interface DescriptifDto {
    Id?: string;
    Groups?: DescriptifGroupDto[];
    Title?: string;
    Title_DE?: string;
    Title_EN?: string;
    Title_FR?: string;
    Title_NL?: string;
    Type?: string;
}