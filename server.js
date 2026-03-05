async function setStatus(status){

  if(!pickerDs) return;

  const date = pickerDs;

  closePicker();
  setLoad(true);

  try{

    if(window.useLocalStorage){

      if(status){
        D[date] = status;
      }else{
        delete D[date];
      }

      localStorage.setItem("attendance_data", JSON.stringify(D));

    } else {

      if(status){

        await supabaseClient
          .from("attendance")
          .upsert(
            { date: date, status: status },
            { onConflict: "date" }
          );

      } else {

        await supabaseClient
          .from("attendance")
          .delete()
          .eq("date", date);

      }

    }

    render();
    showToast(toastMsg(status));

  } catch(err){

    console.error("❌ Save error:", err);
    showToast("⚠ Failed to save", true);

  }

  setLoad(false);
}