import React from 'react';

const Select = ({ array, method, onChangeEvent, idName }) => {
  const onChangeHandler = () => {
    const selectElement = document.getElementById(idName);
    onChangeEvent(selectElement);
  };

  return (
    <select id={idName} onChange={onChangeHandler}>
      {array.map((element, index) => {
        if (index === 0)
          return (
            <option value="">
              Choose {array === 'categories' ? 'a category' : 'an option'} to{' '}
              {method}
            </option>
          );
        else
          return (
            <option value={element}>
              {method} By {element}
            </option>
          );
      })}
    </select>
  );
};

export default Select;
