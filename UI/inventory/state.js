let dataItem = {
  id: null,
  name: null,
  range: null,
  brand: null,
  type: null,
  qty: null,
  cat: null
};

let isEdit = false;

export function setSelectedData(
  idItem,
  nameItem,
  rangeItem,
  brandItem,
  typeItem,
  qtyItem,
  catItem,
) {
  dataItem = {
    id: idItem,
    name: nameItem,
    range: rangeItem,
    brand: brandItem,
    type: typeItem,
    qty: qtyItem,
    cat: catItem
  };
}

export function getSelectedData() {
  return dataItem;
}

export function setIsEdit(value) {
  isEdit = value;
}
export function getIsEdit() {
  return isEdit;
}
