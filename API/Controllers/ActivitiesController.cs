

using Application;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet] //api/activities
        //public async Task<IActionResult> GetActivities()
        public async Task<IActionResult> GetActivities([FromQuery] ActivityParams parameters)
        {
            //return await Mediator.Send(new List.Query());
            //return HandleResult(await Mediator.Send(new List.Query()));
            return HandlePagedResult(await Mediator.Send(new List.Query { Params = parameters }));
        }
      
        // [Authorize]
        [HttpGet("{id}")] //api/activities/fdfdfdd
        public async Task<IActionResult> GetActivity (Guid id)
        {
            //return await Mediator.Send(new Details.Query{Id = id});
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity ([FromBody]Activity activity)
        {
            // await Mediator.Send(new Create.Command {Activity = activity});
            // return Ok();
             return HandleResult(await Mediator.Send(new Create.Command { Activity = activity }));
        }

        [Authorize(Policy = "IsActivityHost")]
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity (Guid id, Activity activity)
        {
            activity.Id = id;
            // await Mediator.Send(new Edit.Command {Activity = activity});
            // return Ok();
            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity (Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend (Guid id)
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command{Id = id}));
        }

    }
}