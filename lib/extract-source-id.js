module.exports =
function extractSourceId(url){

  if(!url){

    return (
      'fallback_' +
      Math.random()
        .toString(36)
        .slice(2)
    );

  }

  return (
    url.match(
      /\/(\d+)(?:\/)?$/
    )?.[1]
    ||
    (
      'fallback_' +
      Math.random()
        .toString(36)
        .slice(2)
    )
  );

};
