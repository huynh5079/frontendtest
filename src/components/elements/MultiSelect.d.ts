import { type FC } from "react";
import type { OptionMultiSelectData } from "../../types/app";
interface MultiSelectProps {
    label: string;
    placeholder?: string;
    options: OptionMultiSelectData[];
    value?: OptionMultiSelectData[];
    onChange?: (options: OptionMultiSelectData[]) => void;
}
declare const MultiSelect: FC<MultiSelectProps>;
export default MultiSelect;
