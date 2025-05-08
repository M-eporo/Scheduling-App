import styles from "../styles/selectColor.module.css";
import { useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CircleIcon from '@mui/icons-material/Circle';
import { colorOptions } from "../utils/optionColors";
import { ColorOptionType, EventObjType } from "../types";

type Props = {
  form: EventObjType
  setForm: React.Dispatch<React.SetStateAction<EventObjType>>;
}

const SelectColor = ({ form, setForm }: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const colorsOpt = colorOptions;
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };
  
  const handleSelect = (option: ColorOptionType) => {
    setForm({
      ...form,
      extendedProps: {
        ...form.extendedProps,
        backgroundColor: option.backgroundColor,
        borderColor: option.borderColor
      }
    });
    setIsDropdownOpen(false);
  };
 
  return (
    <div className={styles.container}>
      <div
        className={styles.selectedOption}
        onClick={toggleDropdown}
        role="button"
      >
        <div className={styles.flex}>
          <ArrowDropDownIcon className={styles.arrow} />
          <CircleIcon style={{color: form.extendedProps.backgroundColor}} />
        </div>
      </div>
      {isDropdownOpen && (
        <div className={styles.dropdown} data-role="color-dropdown">
          {
            colorsOpt.map((option) => (
              <div
                key={option.backgroundColor}
                className={styles.list}
                onClick={() => handleSelect(option)}
              >
                <p className={styles.labelText}>{option.label}</p>
                <CircleIcon className={styles[option.style]} />
              </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectColor;