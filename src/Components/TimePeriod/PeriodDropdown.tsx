import {TimePeriod} from "../../Common/TimePeriod";
import React, {CSSProperties} from "react";
import useMobile from "../../Common/Hooks/Mobile";
import Select, {components, GroupBase, StylesConfig} from "react-select";
import {DropdownIndicatorProps} from "react-select/dist/declarations/src/components/indicators";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type PeriodDropdownOption = { label: string, value: TimePeriod };


function PeriodDropdown({period, setPeriod, options, containerStyle, controlStyle, height = 40, arrowSize = 24}: { period: TimePeriod, setPeriod: (period: TimePeriod) => void, options: PeriodDropdownOption[], containerStyle?: CSSProperties | undefined, controlStyle?: CSSProperties | undefined, height?: number | undefined, arrowSize?: number | undefined }) {
    const isMobile = useMobile();
    const styles: StylesConfig<PeriodDropdownOption, false> = {
        container: base => ({
            ...base,
            width: isMobile ? 80 : 120,
            height: height,
            ...containerStyle
        }),
        control: base => ({
            ...base,
            borderRadius: 20,
            border: 'solid 1px #0058cb',
            minHeight: height,
            height: height,
            ...controlStyle,
        }),
        menu: base => ({
            ...base,
            background: '#000000'
        }),
        valueContainer: base => ({
            ...base,
            height: height,
        })
    }

    const DropdownIndicator = (props: DropdownIndicatorProps<PeriodDropdownOption, false, GroupBase<PeriodDropdownOption>>) => {
        return (
            components.DropdownIndicator && (
                <components.DropdownIndicator {...props}>
                    <ExpandMoreIcon sx={{
                        width: arrowSize,
                        height: arrowSize,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}/>
                </components.DropdownIndicator>
            )
        );
    };

    return (
        <Select menuPlacement="auto"
                menuPosition="fixed"
                isSearchable={false}
                onChange={(option: PeriodDropdownOption | null) => {
                    if (option) {
                        setPeriod(option.value);
                    }
                }}
                value={options.find(option => option.value === period)}
                options={options}
                theme={theme => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        neutral0: '#27293D',
                        neutral5: '#2684ff',
                        neutral10: '#2684ff',
                        neutral20: '#2684ff',
                        neutral30: '#2684ff',
                        neutral40: '#2684ff',
                        neutral50: '#2684ff',
                        neutral60: '#2684ff',
                        neutral70: '#2684ff',
                        neutral80: '#2684ff',
                        neutral90: '#2684ff',
                        primary25: '#161616',
                        primary50: '#2c2c2c',
                        primary: '#2684ff',
                    }
                })}
                styles={styles}
                components={{IndicatorSeparator: null, DropdownIndicator}}/>
    );
}

export default PeriodDropdown;
export type {PeriodDropdownOption};