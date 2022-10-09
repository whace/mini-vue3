import { isObject } from "@seemmo/shared";
import { trackEffects, triggerEffects } from "./effect";

class RefImpl {
  private _value:any
  private dep: Set<any>
  constructor(value){
    this.dep = new Set()
    this._value = value
  }

  get value(){
    trackRefValue(this)
    return this._value
  }

  set value(newVal){
    if(!Object.is(this._value, newVal)){
      this._value = newVal
      triggerRefValue(this)
    }
  }
}

export function ref(raw){
  const refTmpl = new RefImpl(raw)
  return refTmpl
}

function trackRefValue(ref){
  trackEffects(ref.dep)
}

function triggerRefValue(ref){
  triggerEffects(ref.dep)
}