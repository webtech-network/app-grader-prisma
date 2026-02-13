import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ClassesPage from '../../src/views/ClassesPage.vue'
import ActivitiesPage from '../../src/views/ActivitiesPage.vue'
import ProblemPage from '../../src/views/ProblemPage.vue'
import { mockActivities, mockClasses } from '../../src/data/studentData.js'

/**
 * Integration Test: Complete User Flow
 * 
 * This test verifies:
 * - Classes page loads as default route
 * - All classes display correctly
 * - Clicking class navigates to activities page
 * - Activities are filtered by selected class
 * - Clicking activity navigates to problem page
 * - Navigation back works correctly
 * 
 * Requirements: All
 */
describe('Student Portal - Complete User Flow', () => {
  let router
  let wrapper

  beforeEach(async () => {
    // Create router with memory history for testing
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'classes', component: ClassesPage },
        { path: '/class/:classId/activities', name: 'activities', component: ActivitiesPage },
        { path: '/problem/:id', name: 'problem', component: ProblemPage }
      ]
    })

    // Start at classes page
    await router.push('/')
    await router.isReady()
  })

  it('should load classes page as default route', async () => {
    wrapper = mount(ClassesPage, {
      global: {
        plugins: [router]
      }
    })

    // Verify ClassesPage is rendered
    expect(wrapper.find('.classes-page').exists()).toBe(true)
    expect(wrapper.find('.page-title').text()).toBe('Minhas Turmas')
  })

  it('should display all classes correctly', async () => {
    wrapper = mount(ClassesPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    // Verify all classes are displayed
    const classCards = wrapper.findAll('.class-card')
    expect(classCards.length).toBe(mockClasses.length)

    // Verify each class displays its name and description
    mockClasses.forEach((classItem, index) => {
      const card = classCards[index]
      expect(card.text()).toContain(classItem.name)
      expect(card.text()).toContain(classItem.description)
    })
  })

  it('should navigate to activities page when class is clicked', async () => {
    wrapper = mount(ClassesPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    // Get the first class
    const firstClass = mockClasses[0]
    
    // Click on the first class
    const classCards = wrapper.findAll('.class-card')
    await classCards[0].trigger('click')

    // Give time for the navigation to process
    await new Promise(resolve => setTimeout(resolve, 100))
    await router.isReady()

    // Verify router navigated to correct path
    expect(router.currentRoute.value.path).toBe(`/class/${firstClass.id}/activities`)
    expect(router.currentRoute.value.params.classId).toBe(firstClass.id)
  })

  it('should display only activities for selected class', async () => {
    const testClassId = 'cs101'
    
    // Navigate to activities page for cs101
    await router.push(`/class/${testClassId}/activities`)
    await router.isReady()

    wrapper = mount(ActivitiesPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    // Get expected activities for this class
    const expectedActivities = mockActivities.filter(a => a.classId === testClassId)

    // Verify only activities for this class are displayed
    const activityRows = wrapper.findAll('.activity-row')
    expect(activityRows.length).toBe(expectedActivities.length)

    // Verify each activity belongs to the selected class
    expectedActivities.forEach((activity, index) => {
      const row = activityRows[index]
      expect(row.text()).toContain(activity.name)
    })
  })

  it('should display correct dashboard statistics for filtered activities', async () => {
    const testClassId = 'cs101'
    
    await router.push(`/class/${testClassId}/activities`)
    await router.isReady()

    wrapper = mount(ActivitiesPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    // Calculate expected stats for this class only
    const classActivities = mockActivities.filter(a => a.classId === testClassId)
    const expectedSubmittedCount = classActivities.filter(
      activity => activity.lastSubmission !== null
    ).length

    const gradedActivities = classActivities.filter(
      activity => activity.grade !== null
    )
    const expectedAverage = gradedActivities.length > 0
      ? (gradedActivities.reduce((sum, a) => sum + a.grade, 0) / gradedActivities.length).toFixed(1)
      : '—'

    // Verify dashboard displays correct stats
    const dashboard = wrapper.find('.dashboard')
    expect(dashboard.exists()).toBe(true)
    
    const statValues = dashboard.findAll('.stat-value')
    expect(statValues.length).toBe(2)
    
    // Check submitted count
    expect(statValues[0].text()).toBe(expectedSubmittedCount.toString())
    
    // Check average score
    expect(statValues[1].text()).toBe(expectedAverage)
  })

  it('should navigate to problem page when activity is clicked', async () => {
    const testClassId = 'cs101'
    
    await router.push(`/class/${testClassId}/activities`)
    await router.isReady()

    wrapper = mount(ActivitiesPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    // Get the first activity for this class
    const classActivities = mockActivities.filter(a => a.classId === testClassId)
    const firstActivity = classActivities[0]
    
    // Click on the first activity
    const activityRows = wrapper.findAll('.activity-row')
    await activityRows[0].trigger('click')

    // Give time for the navigation to process
    await new Promise(resolve => setTimeout(resolve, 100))
    await router.isReady()

    // Verify router navigated to correct path
    expect(router.currentRoute.value.path).toBe(`/problem/${firstActivity.id}`)
    expect(router.currentRoute.value.params.id).toBe(firstActivity.id)
  })

  it('should navigate back to classes page from activities page', async () => {
    const testClassId = 'cs101'
    
    await router.push(`/class/${testClassId}/activities`)
    await router.isReady()

    wrapper = mount(ActivitiesPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()

    // Click back button
    const backButton = wrapper.find('.back-button')
    await backButton.trigger('click')

    // Give time for the navigation to process
    await new Promise(resolve => setTimeout(resolve, 100))
    await router.isReady()

    // Verify we're back at classes page
    expect(router.currentRoute.value.path).toBe('/')
  })

  it('should complete full user flow: classes -> activities -> problem -> back', async () => {
    // 1. Start at classes page
    wrapper = mount(ClassesPage, {
      global: {
        plugins: [router]
      }
    })

    await wrapper.vm.$nextTick()
    expect(router.currentRoute.value.path).toBe('/')

    // 2. Verify classes page displays all classes
    expect(wrapper.findAll('.class-card').length).toBe(mockClasses.length)

    // 3. Click on first class
    const firstClass = mockClasses[0]
    const classCards = wrapper.findAll('.class-card')
    await classCards[0].trigger('click')
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await router.isReady()

    // 4. Verify navigation to activities page
    expect(router.currentRoute.value.path).toBe(`/class/${firstClass.id}/activities`)

    // 5. Mount activities page and verify filtered activities
    const activitiesWrapper = mount(ActivitiesPage, {
      global: {
        plugins: [router]
      }
    })

    await activitiesWrapper.vm.$nextTick()
    
    const expectedActivities = mockActivities.filter(a => a.classId === firstClass.id)
    expect(activitiesWrapper.findAll('.activity-row').length).toBe(expectedActivities.length)

    // 6. Click on first activity
    const activityRows = activitiesWrapper.findAll('.activity-row')
    await activityRows[0].trigger('click')
    
    await new Promise(resolve => setTimeout(resolve, 100))
    await router.isReady()

    // 7. Verify navigation to problem page
    expect(router.currentRoute.value.path).toBe(`/problem/${expectedActivities[0].id}`)

    // 8. Navigate back to classes
    await router.push('/')
    await router.isReady()

    // 9. Verify we're back at classes page
    expect(router.currentRoute.value.path).toBe('/')
  })
})
