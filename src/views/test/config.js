const holidaysTypeList = [{
  label: '放大舒服',
  value: 1
}, {
  label: '放大舒服2',
  value: 2
}]

const searchConfig = [{
  code: 'date',
  type: 'datePicker',
  datePickerValueFormat: 'yyyy-MM-dd',
  label: '请选择日期'
}, {
  code: 'holidayType',
  type: 'select',
  label: '状态',
  options: holidaysTypeList,
  placeHolder: '请选择状态'
}]

const tableColumns = [{
  prop: 'regionName',
  label: '房贷首付'
}, {
  prop: 'holidayDate',
  label: '日期'
}, {
  prop: 'holidayType',
  label: '状态'
}, {
  prop: 'holidayTypeDesc',
  label: '发大发'
}, {
  prop: 'operate',
  label: '操作'
}]

export {
  searchConfig,
  tableColumns,
  holidaysTypeList
}
