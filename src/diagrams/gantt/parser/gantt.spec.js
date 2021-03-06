/* eslint-env jasmine */
/* eslint-disable no-eval */
import { parser } from './gantt'
import ganttDb from '../ganttDb'

describe('when parsing a gantt diagram it', function () {
  beforeEach(function () {
    parser.yy = ganttDb
    parser.yy.clear()
  })

  it('should handle a dateFormat definition', function () {
    const str = 'gantt\ndateFormat yyyy-mm-dd'

    parser.parse(str)
  })
  it('should handle a title definition', function () {
    const str = 'gantt\ndateFormat yyyy-mm-dd\ntitle Adding gantt diagram functionality to mermaid'

    parser.parse(str)
  })
  it('should handle an excludes definition', function () {
    const str = 'gantt\ndateFormat yyyy-mm-dd\ntitle Adding gantt diagram functionality to mermaid\nexcludes weekdays 2019-02-01'

    parser.parse(str)
  })
  it('should handle a section definition', function () {
    const str = 'gantt\n' +
      'dateFormat yyyy-mm-dd\n' +
      'title Adding gantt diagram functionality to mermaid\n' +
      'excludes weekdays 2019-02-01\n' +
      'section Documentation'

    parser.parse(str)
  })
  /**
   * Beslutsflöde inligt nedan. Obs bla bla bla
   * ```
   * graph TD
   * A[Hard pledge] -- text on link -->B(Round edge)
   * B --> C{to do or not to do}
   * C -->|Too| D[Result one]
   * C -->|Doo| E[Result two]
   ```
   * params bapa - a unique bapap
   */
  it('should handle a task definition', function () {
    const str = 'gantt\n' +
      'dateFormat YYYY-MM-DD\n' +
      'title Adding gantt diagram functionality to mermaid\n' +
      'section Documentation\n' +
      'Design jison grammar:des1, 2014-01-01, 2014-01-04'

    parser.parse(str)

    const tasks = parser.yy.getTasks()

    expect(tasks[0].startTime).toEqual(new Date(2014, 0, 1))
    expect(tasks[0].endTime).toEqual(new Date(2014, 0, 4))
    expect(tasks[0].id).toEqual('des1')
    expect(tasks[0].task).toEqual('Design jison grammar')
  })
  it.each`
    tags                     | milestone | done     | crit     | active
    ${'milestone'}           | ${true}   | ${false} | ${false} | ${false}
    ${'done'}                | ${false}  | ${true}  | ${false} | ${false}
    ${'crit'}                | ${false}  | ${false} | ${true}  | ${false}
    ${'active'}              | ${false}  | ${false} | ${false} | ${true}
    ${'crit,milestone,done'} | ${true}   | ${true}  | ${true}  | ${false}
    `('should handle a task with tags $tags', ({ tags, milestone, done, crit, active }) => {
  const str = 'gantt\n' +
        'dateFormat YYYY-MM-DD\n' +
        'title Adding gantt diagram functionality to mermaid\n' +
        'section Documentation\n' +
        'test task:' + tags + ', 2014-01-01, 2014-01-04'

  const allowedTags = ['active', 'done', 'crit', 'milestone']

  parser.parse(str)

  const tasks = parser.yy.getTasks()

  allowedTags.forEach(function (t) {
    if (eval(t)) {
      expect(tasks[0][t]).toBeTruthy()
    } else {
      expect(tasks[0][t]).toBeFalsy()
    }
  })
})
})
