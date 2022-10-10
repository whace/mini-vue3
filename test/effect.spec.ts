import { effect } from '../src/effect'
import { reactive } from '../src/reactive'

describe('effect',()=>{
  it('happy path', ()=>{
    const user = reactive({
      age: 10
    })

    let nextAge
    effect(()=>{
      nextAge = user.age +1
    })
    expect(nextAge).toBe(11)
    user.age++
    expect(nextAge).toBe(12)
  })

  it('should return runner when call effect', ()=>{
    // effect(fn) -> function(runner) -> fn -> return
    let foo = 10
    const runner = effect(() => {
      foo++
      return 'foo'
    })

    expect(foo).toBe(11)
    const r = runner()
    expect(foo).toBe(12)
    expect(r).toBe("foo")
  })

  it('description', () => {
    /**
     * 1. 通过effect的第二个参数给定的一个scheduler的fn
     * 2. effect第一次执行的时候 还会执行fn
     * 3. 当响应式对象 set update不会执行fn 而是执行 scheduler
     * 4. 如果说当执行runner的时候 会再次执行fn
     */
    let dummy;
    let run: any;

    const scheduler = jest.fn(()=>{
      run = runner
    })

    const obj = reactive({foo:1})
    const runner = effect(()=>{
        dummy = obj.foo
      },
      { scheduler }
    )

    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)

    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })
})