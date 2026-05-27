module.exports =
function dedupeEvents(events){

  return Object.values(

    events.reduce(
      (acc, event) => {

        if(!event.id){

          return acc;

        }

        acc[event.id] = event;

        return acc;

      },
      {}
    )

  );

};
