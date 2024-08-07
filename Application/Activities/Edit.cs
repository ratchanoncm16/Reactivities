
using AutoMapper;
using Domain;
using MediatR;
using Persistence;
using FluentValidation;
using Application.Core;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest <Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

         public class CommandVaildator : AbstractValidator<Command>  
        {
            public CommandVaildator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }      
        
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                //var activity = await _context.Activities.FindAsync(request.Activity.Id);

                //activity.Title = request.Activity.Title ?? activity.Title;
                //_mapper.Map(request.Activity, activity);

                //await _context.SaveChangesAsync();

                //return Unit.Value;
                var activity = await _context.Activities.FindAsync(request.Activity.Id);

                _mapper.Map(request.Activity, activity);
                var result = await _context.SaveChangesAsync() > 0;

                 if (!result) return Result<Unit>.Failure("Falied to update activity");

                return Result<Unit>.Success(Unit.Value);

            }

            
        }
    }
}