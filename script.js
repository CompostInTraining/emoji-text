function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function() {
      console.log("Async: Copying to clipboard was successful!");
    },
    function(err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
}

var replaceMapping = {
  hacker: {
    regexp: /[A-Za-z]/g,
    replace: ":hacker_$&:​",
    downcase: true
  },
  lazer: {
    regexp: /[A-Za-z0-9]/g,
    replace: ":lazer_$&:​",
    downcase: false,
    preUpcase: true
  },
  sm64: {
    regexp: /[A-Za-z0-9'"\?]/g,
    replace: ":sm64_$&:​",
    postReplaceMatch: [/"/g, /'/g, /\?/g],
    postReplace: ["dblquote", "quote", "question"],
    downcase: true
  },
  emoji: {
    regexp: /[A-Za-z0-9#\*]/g,
    replace: ":regional_indicator_$&:​",
    postReplaceMatch: [
      /regional_indicator_0/g,
      /regional_indicator_1/g,
      /regional_indicator_2/g,
      /regional_indicator_3/g,
      /regional_indicator_4/g,
      /regional_indicator_5/g,
      /regional_indicator_6/g,
      /regional_indicator_7/g,
      /regional_indicator_8/g,
      /regional_indicator_9/g,
      /regional_indicator_#/g,
      /regional_indicator_\*/g,
      /regional_indicator_b/g
    ],
    postReplace: [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "hash",
      "keycap_star",
      "b"
    ],
    downcase: true
  },
  clapping: {
    regexp: /\s/g,
    replace: "👏",
    postReplaceMatch: [/$/],
    postReplace: ["👏"],
    downcase: false
  },
  bun: {
    regexp: /\s/g,
    replace: " :bun: ",
    postReplaceMatch: [/$/],
    postReplace: [" :bun: "],
    downcase: false
  },
  spaced: {
    regexp: /./g,
    replace: "$& ",
    downcase: false
  }
};

function updateOutput() {
  let inString = $("#inputBox").val();
  const selectedEmote = $("#emoteType").val();


  const mapping = replaceMapping[selectedEmote];
  const regexp = mapping.regexp;
  const replaceStr = mapping.replace;

  if(mapping.preUpcase === true) {
    inString = inString.toUpperCase();
  }

  let outString = inString.replace(regexp, replaceStr);

  if (mapping.downcase === true) {
    outString = outString.toLowerCase();
  }

  if (mapping.postReplaceMatch) {
    for (let i = 0; i < mapping.postReplaceMatch.length; i++) {
      outString = outString.replace(
        mapping.postReplaceMatch[i],
        mapping.postReplace[i]
      );
    }
  }
  const finalString = outString.trim();
  
  $("#chars").text("Characters: " + finalString.length);
  $("#outputBox").val(finalString);
}

$(document).ready(function() {
  $("#inputBox").on("input propertychange", function(e) {
    updateOutput();
  });

  $("#emoteType").change(function(e) {
    updateOutput();
  });

  $("#copyButton").on("click", function(e) {
    copyTextToClipboard($("#outputBox").val());
  });
});
