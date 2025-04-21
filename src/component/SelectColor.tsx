import styles from "../styles/selectColor.module.css";
import { useRef } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CircleIcon from '@mui/icons-material/Circle';
import { colorOptions } from "../utils/optionColors";
import { ColorOptionType, EventObjType } from "../types";

type Props = {
  form: EventObjType
  setForm: React.Dispatch<React.SetStateAction<EventObjType>>;
}

const SelectColor = ({ form, setForm }: Props) => {
  const colorsOpt = colorOptions;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGSVGElement>(null);
  
  const handleSelect = (option: ColorOptionType) => {
    setForm({
      ...form,
      extendedProps: {
        desc: form.extendedProps.desc,
        backgroundColor: option.value,
        borderColor: option.value
      } 
    });

    if (circleRef.current && dropdownRef.current) {
      circleRef.current.style.color = option.value;
      if (dropdownRef.current.style.display === "none") {
        dropdownRef.current.style.display = "grid";
      } else {
        dropdownRef.current.style.display = "none";
      }
    }
    
  };

  const listShow = () => {
    if (dropdownRef.current) {
      if (dropdownRef.current.style.display === "none") {
        dropdownRef.current.style.display = "grid";
      } else {
        dropdownRef.current.style.display = "none";
      }
    }
  };
 
  return (
    <div className={styles.container}>
      <div
        className={styles.selectedOption}
        onClick={() => listShow()}
      >
        <div className={styles.flex}>
          <ArrowDropDownIcon className={styles.arrow} />
          <CircleIcon ref={circleRef} style={{color: form.extendedProps.backgroundColor}} />
        </div>
      </div>
      
        <div ref={dropdownRef} className={styles.dropdown}>
          {
            colorsOpt.map((option) => (
              <div
                ref={itemRef}
                key={option.value}
                className={styles.list}
                onClick={() => handleSelect(option)}
              >
                <p className={styles.labelText}>{option.label}</p>
                <CircleIcon className={styles[option.style]} />
              </div>
          ))}
        </div>
       
    </div>
  );
};

export default SelectColor;