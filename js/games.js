// Simple random selection games
window.Games = (function(){
  function pickRandom(students){
    if(!students || !students.length) return null;
    return students[Math.floor(Math.random()*students.length)];
  }

  function spinWheel(students){
    const winner = pickRandom(students);
    if(window.showToast){ showToast('🎉 تم اختيار: '+(winner?winner.name:'---'),'success'); }
    return winner;
  }

  function treasureCard(students){
    const winner = pickRandom(students);
    if(window.showToast){ showToast('🧧 بطاقة الكنز: '+(winner?winner.name:'---'),'success'); }
    return winner;
  }

  function scratchCard(students){
    const winner = pickRandom(students);
    if(window.showToast){ showToast('🪪 بطاقة الخدش: '+(winner?winner.name:'---'),'success'); }
    return winner;
  }

  function quickDraw(students){
    const winner = pickRandom(students);
    if(window.showToast){ showToast('⚡ السحب السريع: '+(winner?winner.name:'---'),'success'); }
    return winner;
  }

  function fastTrainPick(students,count=1){
    const out=[]; const pool=[...students];
    for(let i=0;i<count && pool.length;i++){
      const idx=Math.floor(Math.random()*pool.length); out.push(pool.splice(idx,1)[0]);
    }
    if(window.showToast){ showToast('🚆 القطار السريع: '+out.map(o=>o.name).join(', '),'success'); }
    return out;
  }

  return { spinWheel, treasureCard, scratchCard, quickDraw, fastTrainPick };
})();
