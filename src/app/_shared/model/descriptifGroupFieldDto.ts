import { DescriptifGroupFieldAnswerDto } from "./descriptifGroupFieldAnswerDto";

export interface DescriptifGroupFieldDto {
    Answers?: DescriptifGroupFieldAnswerDto[];
    Articles?: string;
    Code?: string;
    DefaultAnswers?: DescriptifGroupFieldAnswerDto[];
    Id?: string;
    IsMandatory?: boolean;
    Label?: string;
    LabelShort?: string;
    Label_DE?: string;
    Label_EN?: string;
    Label_FR?: string;
    Label_NL?: string;
    ParentID?: string;
    ResultType?: string;
    Type?: string;
}