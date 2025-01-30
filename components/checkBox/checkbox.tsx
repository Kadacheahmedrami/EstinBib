import React from 'react';
import styles from './NeonCheckbox.module.css'; // Assuming you have a CSS module for styles
import {CheckboxProps} from '@/types/_types'


const NeonCheckbox: React.FC<CheckboxProps> = ({ id, checked, onChange }) => {
  return (
    <label className={styles.neonCheckbox} htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.hiddenInput}
      />
      <div className={styles.neonCheckboxFrame}>
        <div className={styles.neonCheckboxBox}>
          <div className={styles.neonCheckboxCheckContainer}>
            <svg viewBox="0 0 24 24" className={styles.neonCheckboxCheck}>
              <path d="M3,12.5l7,7L21,5"></path>
            </svg>
          </div>
          <div className={styles.neonCheckboxGlow}></div>
          <div className={styles.neonCheckboxBorders}>
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div className={styles.neonCheckboxEffects}>
          <div className={styles.neonCheckboxParticles}>
            {[...Array(12)].map((_, i) => (
              <span key={i}></span>
            ))}
          </div>
          <div className={styles.neonCheckboxRings}>
            <div className={styles.ring}></div>
            <div className={styles.ring}></div>
            <div className={styles.ring}></div>
          </div>
          <div className={styles.neonCheckboxSparks}>
            {[...Array(4)].map((_, i) => (
              <span key={i}></span>
            ))}
          </div>
        </div>
      </div>
    </label>
  );
};

export default NeonCheckbox;