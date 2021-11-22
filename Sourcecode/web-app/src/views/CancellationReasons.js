import React, { useState, useEffect, useContext } from 'react';
import MaterialTable from 'material-table';
import { useSelector, useDispatch } from "react-redux";
import CircularLoading from "../components/CircularLoading";
import { FirebaseContext } from 'common';
import { useTranslation } from "react-i18next";

export default function CancellationReasons() {
  const { api } = useContext(FirebaseContext);
  const { t } = useTranslation();
  const {
    editCancellationReason
  } = api;
  const columns = [
    { title: t('reason'), field: 'label' ,render: rowData => <span>{rowData.label}</span>}
  ];
  const settings = useSelector(state => state.settingsdata.settings);
  const [data, setData] = useState([]);
  const cancelreasondata = useSelector(state => state.cancelreasondata);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cancelreasondata.complex) {
      setData(cancelreasondata.complex);
    }else{
      setData([]);
    }
  }, [cancelreasondata.complex]);

  return (
    cancelreasondata.loading ? <CircularLoading /> :
      <MaterialTable
        title={t('cancellation_reasons')}
        columns={columns}
        data={data}
        options={{
          exportButton: true,
          pageSize: 10
        }}
        editable={settings.AllowCriticalEditsAdmin ? {
            onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const tblData = data;
                newData.value = tblData.length
                tblData.push(newData);
                dispatch(editCancellationReason(tblData, "Add"));
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const tblData = data;
                tblData[tblData.indexOf(oldData)] = newData;
                dispatch(editCancellationReason(tblData, "Update"));
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                const tblData = data;
                tblData.splice(tblData.indexOf(oldData), 1);
                for(let i=0;i<tblData.length;i++){
                  tblData[i].value = i;
                }
                dispatch(editCancellationReason(tblData, "Delete"));
              }, 600);
            }),
        } : null}
      />
  );
}