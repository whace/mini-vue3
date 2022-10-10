let activeEffect:ReactiveEffect

export function effect(fn:Function,options: any = {}){
  const scheduler = options.scheduler
  const _effect = new  ReactiveEffect(fn,scheduler)
  _effect.run()
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}

class ReactiveEffect {
  private _fn: Function
  deps = []
  constructor(fn:Function,public scheduler?){
    this._fn = fn
  }
  run() {
    activeEffect = this
    this._fn()
  }
  stop(){
    cleanupEffect(this)
  }
}

const targetMap = new Map()
export function track(target, key){
  let depsMap = targetMap.get(target)
  if(!depsMap){
    depsMap = new Map()
    targetMap.set(target,depsMap)
  }
  let dep = depsMap.get(key) 
  if(!dep){
    dep = new Set()
    depsMap.set(key,dep)
  }
  trackEffects(dep)
}

function cleanupEffect(effect){
  effect
}

export function trackEffects(dep){
  dep.add(activeEffect)
}

export function trigger(target, key){
  const depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  triggerEffects(dep)
}

export function triggerEffects(dep){
  for(const effect of dep){
    if(effect.scheduler){
      effect.scheduler()
    }else{
      effect.run()
    }
  }
}

